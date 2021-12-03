import { getRegion } from "../src/utilities";

describe("Region", () => {
  it("should resolve with region key samanabad_town", async () => {
    const response = await getRegion(31.536558, 74.298223);
    expect(response.key).toEqual("samanabad_town");
  });
  it("should resolve with region key mana_wala", async () => {
    const response = await getRegion(31.47540978593523, 74.41877239420648);
    expect(response.key).toEqual("mana_wala");
  });
  it("should resolve with region key sector_k_phase_5_d.h.a", async () => {
    const response = await getRegion(31.465691265405365, 74.39871496155276);
    expect(response.key).toEqual("sector_k_phase_5_d.h.a");
  });
});
