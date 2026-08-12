import { Request, Response } from "express";
import {
  cancelChallan,
  confirmChallan,
  createChallan,
  getChallanById,
  getChallans,
} from "../services/challan.service.js";

import { ChallanStatus } from "../generated/prisma/client.js";

export const createChallanController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const challan = await createChallan(req.body, req.user.userId);

    return res.status(201).json({
      success: true,
      challan,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create challan",
    });
  }
};

export const getChallansController = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;

    const status =
      typeof req.query.status === "string" &&
      Object.values(ChallanStatus).includes(req.query.status as ChallanStatus)
        ? (req.query.status as ChallanStatus)
        : undefined;

    const result = await getChallans({
      page,
      limit,
      search,
      status,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch challans",
    });
  }
};

export const getChallanController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID",
      });
    }

    const challan = await getChallanById(id);

    if (!challan) {
      return res.status(404).json({
        success: false,
        message: "Challan not found",
      });
    }

    return res.status(200).json({
      success: true,
      challan,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch challan",
    });
  }
};

export const confirmChallanController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID",
      });
    }

    const challan = await confirmChallan(id, req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Challan confirmed successfully",
      challan,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to confirm challan",
    });
  }
};

export const cancelChallanController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID",
      });
    }

    const challan = await cancelChallan(id);

    return res.status(200).json({
      success: true,
      message: "Challan cancelled successfully",
      challan,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to cancel challan",
    });
  }
};
