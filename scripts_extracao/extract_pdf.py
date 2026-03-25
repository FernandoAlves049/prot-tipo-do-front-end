import glob

try:
    import PyPDF2
    for pdf in glob.glob("*.pdf"):
        print(f"Reading {pdf}")
        with open(pdf, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for i, page in enumerate(reader.pages):
                print(f"--- PAGE {i+1} ---")
                text = page.extract_text()
                if text:
                    print(text.strip())
                else:
                    print("[No text found]")
except Exception as e1:
    try:
        import pypdf
        for pdf in glob.glob("*.pdf"):
            print(f"Reading {pdf}")
            with open(pdf, 'rb') as f:
                reader = pypdf.PdfReader(f)
                for i, page in enumerate(reader.pages):
                    print(f"--- PAGE {i+1} ---")
                    text = page.extract_text()
                    if text:
                        print(text.strip())
                    else:
                        print("[No text found]")
    except Exception as e2:
        print(f"Failed to read pdf. {e1} | {e2}")
