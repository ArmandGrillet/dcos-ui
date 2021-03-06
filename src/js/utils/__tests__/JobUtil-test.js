const Job = require("../../structs/Job");
const JobUtil = require("../JobUtil");

describe("JobUtil", function() {
  describe("#createJobFromFormModel", function() {
    it("returns instance of Job", function() {
      const job = JobUtil.createJobFromFormModel({
        general: { id: "test" }
      });

      expect(job).toEqual(jasmine.any(Job));
    });

    it("returns instance Job if null is provided", function() {
      expect(JobUtil.createJobFromFormModel(null)).toEqual(jasmine.any(Job));
    });

    it("returns instance Job if empty object is provided", function() {
      expect(JobUtil.createJobFromFormModel({})).toEqual(jasmine.any(Job));
    });

    it("converts form model to the corresponding job", function() {
      const job = JobUtil.createJobFromFormModel({
        general: { id: "test", cmd: "sleep 1000;" }
      });

      expect(job.getId()).toEqual("test");
      expect(job.getCommand()).toEqual("sleep 1000;");
    });

    it("returns job with schedule if actiavted", function() {
      const job = JobUtil.createJobFromFormModel({
        general: { id: "test", cmd: "sleep 1000;" },
        schedule: {
          id: "default",
          cron: "* * * * *",
          enabled: true,
          concurrencyPolicy: "ALLOW",
          runOnSchedule: true
        }
      });

      expect(job.getSchedules()).toEqual([
        {
          id: "default",
          cron: "* * * * *",
          enabled: true,
          concurrencyPolicy: "ALLOW"
        }
      ]);
    });

    it("job schedule maintains id and policy", function() {
      const job = JobUtil.createJobFromFormModel({
        general: { id: "test", cmd: "sleep 1000;" },
        schedule: {
          id: "fluffy",
          cron: "* * * * *",
          enabled: true,
          concurrencyPolicy: "FORBID",
          runOnSchedule: true
        }
      });

      expect(job.getSchedules()).toEqual([
        {
          id: "fluffy",
          cron: "* * * * *",
          enabled: true,
          concurrencyPolicy: "FORBID"
        }
      ]);
    });

    it("job schedule defaults concurrencyPolicy if not provided", function() {
      const job = JobUtil.createJobFromFormModel({
        general: { id: "test", cmd: "sleep 1000;" },
        schedule: {
          id: "fluffy",
          cron: "* * * * *",
          enabled: true,
          runOnSchedule: true
        }
      });

      expect(job.getSchedules()).toEqual([
        {
          id: "fluffy",
          cron: "* * * * *",
          enabled: true,
          concurrencyPolicy: "ALLOW"
        }
      ]);
    });

    it("removes schedule if deactivated", function() {
      const job = JobUtil.createJobFromFormModel({
        general: { id: "test", cmd: "sleep 1000;" },
        schedule: {
          id: "default",
          cron: "* * * * *",
          enabled: true,
          concurrencyPolicy: "ALLOW",
          runOnSchedule: false
        }
      });

      expect(job.getSchedules()).toEqual([]);
    });
  });

  describe("#createFormModelFromSchema", function() {
    it("creates the correct model", function() {
      const schema = {
        type: "object",
        properties: {
          general: {
            description: "Configure your container",
            type: "object",
            properties: {
              id: {
                default: "job.id",
                title: "ID",
                description: "The id for the job",
                type: "string",
                getter(job) {
                  return job.getId();
                }
              }
            }
          }
        },
        required: ["general"]
      };

      const job = new Job({ id: "test" });

      expect(JobUtil.createFormModelFromSchema(schema, job)).toEqual({
        general: { id: "test" }
      });
    });
  });

  describe("#createJobSpecFromJob", function() {
    it("creates the correct job", function() {
      const job = new Job({
        id: "test",
        run: {
          cmd: "sleep 1000;"
        }
      });

      expect(JobUtil.createJobSpecFromJob(job)).toEqual({
        id: "test",
        run: {
          cmd: "sleep 1000;",
          cpus: 0.01,
          mem: 128,
          disk: 0
        },
        schedules: []
      });
    });

    it("adds concurrencyPolicy if schedule is defined", function() {
      const job = new Job({
        id: "test",
        run: {
          cmd: "sleep 1000;"
        },
        schedules: [
          {
            id: "every-minute",
            cron: "* * * * *"
          }
        ]
      });

      expect(JobUtil.createJobSpecFromJob(job).schedules[0]).toEqual({
        id: "every-minute",
        enabled: true,
        concurrencyPolicy: "ALLOW",
        cron: "* * * * *"
      });
    });
  });
});
