import {getTier, GetTierError} from "../../../src/shared/util/get-tier";
import {expect} from "chai";

describe("getTier", function() {

  // the census API seems to be slow; set timeout to 4s
  this.timeout(6000);

  it("should throw INVALID_ADDRESS for correct addresses", function(done) {
    const address = "awdkjawkdljawlkfjewflkrejf";
    getTier(address).then( res => {
      // expect this not to be called
      done(new Error(`getTier should have thrown with address ${address}`));
    }).catch( err => {
      expect(err).to.equal(GetTierError.InvalidAddressErr);
      done();
    });
  });

  it("should throw NO_TIER_FOUND for addresses outside CPS boundaries", function(done) {
    const address = "524 West 4th Avenue, Anchorage, Alaska";
    getTier(address).then( res => {
      // expect this not to be called
      done(new Error(`getTier should have thrown with address ${address}`));
    }).catch( err => {
      expect(err).to.equal(GetTierError.NoTierFoundErr);
      done();
    });
  });

  it("should get correct tier for Chavez' full address", function(done) {
    const address = "4747 S Marshield Av., Chicago IL 60609";
    const expectedTier = "1";
    getTier(address).then( res => {
      expect(res).to.equal(expectedTier);
      done();
    }).catch( err => done(err));
  });

  it("should get correct tier for this random tier 3 address", function(done) {
    const address = "2929 W Cullom Av., Chicago IL 60618";
    const expectedTier = "3";
    getTier(address).then( res => {
      expect(res).to.equal(expectedTier);
      done();
    }).catch( err => done(err));
  });

  it("should get correct tier for this random tier 1 address", function(done) {
    const address = "4720 S Ellis Ave, Chicago, IL 60615";
    const expectedTier = "1";
    getTier(address).then( res => {
      expect(res).to.equal(expectedTier);
      done();
    }).catch( err => done(err));
  });

  it("should get correct tier for the turtle racing bar's address", function(done) {
    const address = "1818 W Foster Ave, Chicago, IL 60640";
    const expectedTier = "4";
    getTier(address).then( res => {
      expect(res).to.equal(expectedTier);
      done();
    }).catch( err => done(err));
  });

  it("should get correct tier for addresses with extra whitespace", function(done) {
    const address = "     4747   S Marshield Av.       , Chicago IL 60609";
    const expectedTier = "1";
    getTier(address).then( res => {
      expect(res).to.equal(expectedTier);
      done();
    }).catch( err => done(err));
  });

  xit("should get correct tier for addresses with only street and numbers", function(done) {
    const address = "4747 S Marshield Av,";
    const expectedTier = "1";
    getTier(address).then( res => {
      expect(res).to.equal(expectedTier);
      done();
    }).catch( err => done(err));
  });

  xit("should get correct tier for addresses with apartment numbers added on", function(done) {
    const address = "4720 S Ellis, Apt 1";
    const expectedTier = "2";
    getTier(address).then( res => {
      expect(res).to.equal(expectedTier);
      done();
    }).catch( err => done(err));
  });

});
