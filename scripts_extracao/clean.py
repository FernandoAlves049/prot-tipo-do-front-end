with open('pdf_text.txt', 'rb') as f:
    content = f.read().decode('utf-8', errors='replace')
with open('pdf_clean.md', 'w', encoding='utf-8') as f:
    f.write(content)
