#!/usr/bin/env node
import { Command } from 'commander';
import { validate } from './validator.js';

const program = new Command();

program
  .name('okp')
  .description('OKP compliance validator — check if a URL implements Open Knowledge Protocol')
  .version('0.0.1-preview.0');

program
  .command('validate <url>')
  .description('Validate OKP compliance of a site URL')
  .action(async (url: string) => {
    try {
      process.stdout.write(`Checking OKP compliance for: ${url}\n`);
      const report = await validate(url);

      process.stdout.write(`\nOverall Score: ${report.overallScore}/100 (${report.tier.toUpperCase()})\n`);
      process.stdout.write(`Checked at: ${report.checkedAt}\n\n`);
      process.stdout.write('Dimensions:\n');

      for (const dim of report.dimensions) {
        const status = dim.passed ? '✓' : '✗';
        process.stdout.write(`  ${status} ${dim.dimension}: ${dim.score}/100\n`);
        for (const issue of dim.issues) {
          process.stdout.write(`      → ${issue}\n`);
        }
      }

      process.stdout.write('\nExtras:\n');
      process.stdout.write(`  MCP endpoint: ${report.extras.hasMcpEndpoint ? 'yes' : 'no'}\n`);
      process.stdout.write(`  llms.txt: ${report.extras.hasLlmsTxt ? 'yes' : 'no'}\n`);
      process.stdout.write(`  JSON-LD blocks: ${report.extras.jsonLdBlocksFound}\n`);

      // Exit code 1 = checked but non-compliant (useful for CI scripts)
      // Exit code 2 = could not check (network/parse error)
      process.exit(report.tier === 'non-compliant' ? 1 : 0);
    } catch (err) {
      process.stderr.write(`Error: failed to check ${url}: ${String(err)}\n`);
      process.exit(2);
    }
  });

program.parse();
