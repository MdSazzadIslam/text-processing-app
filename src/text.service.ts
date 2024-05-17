import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { TextDto } from './dto/textDto';
import { ReportDto } from './dto/reportDto';

@Injectable()
export class TextService {
  private wordCounts: { [word: string]: number } = {};
  private readonly logger = new Logger(TextService.name);

  processText(textDto: TextDto): void {
    const words = this.extractWords(textDto.text);

    if (this.containsCommonWord(words, 'the')) {
      this.logger.warn('Text submission contains the word "the". Ignoring.');
      throw new BadRequestException('Text submission contains the word "the".');
    }

    this.updateWordCounts(words);
  }

  generateReport(reportDto: ReportDto): { word: string; count: number }[] {
    const sortedWords = this.sortWordCounts();
    const topWords = this.extractTopWords(
      sortedWords,
      reportDto.numCommonWords,
    );
    return topWords;
  }

  private extractWords(text: string): string[] {
    // Normalize text to lowercase and split into words
    const words = text.toLowerCase().split(/\s+/);

    // Remove punctuation from each word
    const wordsWithoutPunctuation = words.map((word) =>
      word.replace(/[^\w\s]/g, ''),
    );

    return wordsWithoutPunctuation;
  }

  private containsCommonWord(words: string[], commonWord: string): boolean {
    return words.includes(commonWord);
  }

  private updateWordCounts(words: string[]): void {
    for (const word of words) {
      this.wordCounts[word] = (this.wordCounts[word] || 0) + 1;
    }
  }

  private sortWordCounts(): [string, number][] {
    return Object.entries(this.wordCounts).sort((a, b) => b[1] - a[1]);
  }

  private extractTopWords(
    sortedWords: [string, number][],
    numCommonWords: number,
  ): { word: string; count: number }[] {
    return sortedWords
      .slice(0, numCommonWords)
      .map(([word, count]) => ({ word, count }));
  }
}
