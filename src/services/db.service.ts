import PR from "../models/pr.model";

export const createPr = async () => {
  try {
    const pr = await PR.create({
      status: "processing",
    });
    return { prid: pr.dataValues.prid, status: pr.dataValues.status };
  } catch (error) {
    console.log(error);
  }
};

export const getPrStatus = async (prid: string) => {
  try {
    const pr = await PR.findOne({ where: { prid: prid } });
    if(!pr) {
      throw new Error("PR not found");
    }
    return { prid: pr?.dataValues.prid, status: pr?.dataValues.status };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPrReview = async (prid: string) => {
  try {
    const pr = await PR.findOne({ where: { prid: prid } });
    if(!pr) {
      throw new Error("PR not found");
    }
    return {
      prid: pr?.dataValues.prid,
      status: pr?.dataValues.status,
      review: pr?.dataValues.response,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateStatus = async (prid: number) => {
  try {
    const pr = await PR.findOne({ where: { prid: prid } });
    if (pr) {
      pr.status = "failed";
    }
    await pr?.save();
  } catch (error) {}
};

export const saveReview = async (prid: number, review: string) => {
  try {
    const pr = await PR.findOne({ where: { prid: prid } });
    if (pr) {
      pr.response = review;
      pr.status = "success";
    }
    await pr?.save();
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Error in saving review");
  }
};
