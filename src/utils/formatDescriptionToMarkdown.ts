export function formatMarkdown(input: string | undefined): string {
  let formattedDescription: string = "";
  if (input) formattedDescription = input.replace(/\\n/g, "\n");
  return formattedDescription;
}
