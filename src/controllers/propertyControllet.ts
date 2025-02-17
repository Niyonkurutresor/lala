import { Request, Response } from "express";
import * as PropertyServices from "../services/PropertyServices";
import { generateId } from "../utils/generateId";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import respond from "../utils/response";
import { queryFilter } from "../utils/queryFilter";
import userServices from "../services/userServices";
export const create = async (req: Request, res: Response) => {
  try {
    const property_id = generateId();
    await PropertyServices.create({
      ...req.body,
      property_id,
      host_id: req.authData.user_id,
    });
    const propety = await PropertyServices.findById(property_id);
    if (!propety)
      throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong");
    await userServices.updateRole("HOSTER", req.authData.user_id);
    respond(res, true, "Property Create successfully!", propety);
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { property_id } = req.params;
    const property = await PropertyServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    console.log(req.authData.user_id);
    if (property.host_id !== req.authData.user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to update this property data."
      );
    await PropertyServices.update({ ...req.body, property_id });
    const updatedProperty = await PropertyServices.findById(property_id);
    respond(res, true, "Property updated sucessfully!", updatedProperty);
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const findMany = async (req: Request, res: Response) => {
  try {
    const query = queryFilter(req.query);
    const properties = await PropertyServices.findMany(query.skip, query.limit);
    if (!properties)
      throw new ApiError(httpStatus.NOT_FOUND, "There is not Properites");
    respond(res, true, "Propeties found successfully", properties);
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const findById = async (req: Request, res: Response) => {
  try {
    const { property_id } = req.params;
    console.log(property_id);
    const property = await PropertyServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    respond(res, true, "Property foudn successfully", property);
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const { property_id } = req.params;
    const property = await PropertyServices.findById(property_id);
    if (!property)
      throw new ApiError(httpStatus.NOT_FOUND, "Property does not exist.");
    if (property.host_id !== req.authData.user_id)
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not allowed to delete this property."
      );
    await PropertyServices.deleteById(property_id);
    respond(res, true, "Property deleted successfully!");
  } catch (error: any) {
    console.error("Error forget password:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
