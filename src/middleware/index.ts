import multer from "multer";
import path from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

interface FileInfo {
  fieldname: string;
  originalname: string;
  mimetype: string;
}

const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: FileInfo,
    cb: DestinationCallback
  ) => {
    cb(null, "uploads/");
  },
  filename: (req: Express.Request, file: FileInfo, cb: FileNameCallback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

export const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  },
});

export const uploadBuffer = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});
