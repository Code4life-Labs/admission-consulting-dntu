export function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n')
}