import { createWorker, Worker } from 'tesseract.js';

export class OCRProcessor {
  private worker: Worker | null = null;

  async initialize() {
    this.worker = await createWorker();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
  }

  async processImage(file: File): Promise<string | null> {
    if (!this.worker) {
      await this.initialize();
    }

    if (!this.worker) {
      throw new Error('Failed to initialize OCR worker');
    }

    const { data: { text } } = await this.worker.recognize(file);
    const numbers = text.match(/\d+(\.\d+)?/g);
    
    return numbers?.[0] || null;
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}