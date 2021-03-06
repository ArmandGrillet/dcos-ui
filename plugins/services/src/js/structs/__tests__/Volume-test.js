const Volume = require("../Volume");
const VolumeStatus = require("../../constants/VolumeStatus");
const VolumeProfile = require("../../constants/VolumeProfile");
const VolumeDefinitions = require("../../constants/VolumeDefinitions");

describe("Volume", function() {
  describe("#getContainerPath", function() {
    it("returns correct container path", function() {
      const service = new Volume({
        containerPath: "/data"
      });

      expect(service.getContainerPath()).toEqual("/data");
    });
  });

  describe("#getHost", function() {
    it("returns correct host", function() {
      const service = new Volume({
        host: "127.0.0.1"
      });

      expect(service.getHost()).toEqual("127.0.0.1");
    });
  });

  describe("#getId", function() {
    it("returns correct id", function() {
      const service = new Volume({
        id: "volume.id"
      });

      expect(service.getId()).toEqual("volume.id");
    });
  });

  describe("#getMode", function() {
    it("returns correct mode", function() {
      const service = new Volume({
        mode: "rw"
      });

      expect(service.getMode()).toEqual("rw");
    });
  });

  describe("#getType", function() {
    it("returns unavailable if no profile is defined", function() {
      const service = new Volume({});

      expect(service.getProfile()).toEqual(VolumeProfile.UNAVAILABLE);
    });

    it("returns correct profile", function() {
      const service = new Volume({
        profileName: "SSD"
      });

      expect(service.getProfile()).toEqual("SSD");
    });
  });

  describe("#getStatus", function() {
    it("returns unavailable if no  status is defined", function() {
      const service = new Volume({});

      expect(service.getStatus()).toEqual(VolumeStatus.UNAVAILABLE);
    });

    it("returns correct status", function() {
      const service = new Volume({
        status: VolumeStatus.ATTACHED
      });

      expect(service.getStatus()).toEqual(VolumeStatus.ATTACHED);
    });
  });

  describe("#getSize", function() {
    it("returns correct size", function() {
      const service = new Volume({
        size: 256
      });

      expect(service.getSize()).toEqual(256);
    });
  });

  describe("#getType", function() {
    it("returns correct type", function() {
      const service = new Volume({
        type: VolumeDefinitions.PERSISTENT.type
      });

      expect(service.getType()).toEqual(VolumeDefinitions.PERSISTENT.type);
    });
  });

  describe("#getTaskID", function() {
    it("returns correct type", function() {
      const service = new Volume({
        taskID: "foo"
      });

      expect(service.getTaskID()).toEqual("foo");
    });
  });
});
