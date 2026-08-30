import pymupdf
import pytesseract
from pdf2image import convert_from_path

pytesseract.pytesseract.tesseract_cmd = r"D:\Tesseract-OCR\tesseract.exe"

# Point directly to the folder containing pdfinfo.exe / pdftoppm.exe
POPPLER_PATH = r"D:\poppler\bin"  # Update to D:\poppler\Library\bin if installed there


def extract_text_from_pdf(file_path: str) -> str:
    document = pymupdf.open(file_path)
    pages_text = []

    for page in document:
        text = page.get_text("text", sort=True)
        pages_text.append(text)

    document.close()

    full_text = "\n".join(pages_text).strip()

    if not full_text:
        print("[pdf_loader] Document is image-based. Processing OCR...")
        try:
            images = convert_from_path(file_path, poppler_path=POPPLER_PATH)
            ocr_text = []
            for img in images:
                ocr_text.append(pytesseract.image_to_string(img))
            full_text = "\n".join(ocr_text).strip()
            print(f"[pdf_loader] OCR finished. Extracted {len(full_text)} characters.")
        except Exception as e:
            print(f"[pdf_loader] OCR Error: {e}")

    return full_text