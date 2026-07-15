import { importJobsFromBuffer } from "../services/import.service.js";
import resumeService from "../services/resume.service.js";
import { PDFParse } from "pdf-parse";
import { XMLParser } from "fast-xml-parser";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/error.utils.js";

function parseXmlResume(xmlData) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    });
    const jsonObj = parser.parse(xmlData);
    
    const formatObj = (obj, depth = 0) => {
        if (obj === null || obj === undefined) return "";
        if (typeof obj !== "object") return String(obj);
        
        let text = "";
        const indent = "  ".repeat(depth);
        if (Array.isArray(obj)) {
            return obj.map(item => `${indent}- ${formatObj(item, depth + 1)}`).join("\n");
        }
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === "object") {
                text += `\n${indent}${key}:\n${formatObj(value, depth + 1)}`;
            } else {
                text += `\n${indent}${key}: ${value}`;
            }
        }
        return text.trim();
    };

    return formatObj(jsonObj);
}

class FileController {

    
    importJobs = asyncHandler(async (req, res) => {

        let file = req.file;

        if (!file) throw new AppError(400, "Please upload an Excel (.xlsx) file.");

        const summary = await importJobsFromBuffer(file.buffer, file.originalname);

        res.success(200, "Excel spreadsheet imported successfully.", summary);
    });


    tailorResume = asyncHandler(async (req, res) => {
        const jobId = req.body.jobId;

        if (!jobId) throw new AppError(400, "Job ID is required.");
        if (!req.file) throw new AppError(400, "Resume file is required.");

        const isPdf = req.file.mimetype === "application/pdf" || req.file.originalname.endsWith(".pdf");
        const isXml = req.file.mimetype === "application/xml" || req.file.mimetype === "text/xml" || req.file.originalname.endsWith(".xml");

        if (!isPdf && !isXml) {
            throw new AppError(400, "Only PDF and XML resume uploads are supported.");
        }

        let resumeText = "";
        if (isPdf) {
            try {
                const parser = new PDFParse({ data: req.file.buffer });
                const result = await parser.getText();
                await parser.destroy();
                resumeText = result.text;
            } catch (err) {
                throw new AppError(400, `Failed to parse PDF resume: ${err.message}`);
            }
        } else if (isXml) {
            try {
                const xmlData = req.file.buffer.toString("utf-8");
                resumeText = parseXmlResume(xmlData);
            } catch (err) {
                throw new AppError(400, `Failed to parse XML resume: ${err.message}`);
            }
        }

        if (!resumeText || !resumeText.trim()) {
            throw new AppError(400, "Could not extract text content from the uploaded resume.");
        }

        const data = await resumeService.tailorResume(resumeText, jobId);
        res.success(200, "Resume tailored successfully.", data);
    });

}


export default new FileController()