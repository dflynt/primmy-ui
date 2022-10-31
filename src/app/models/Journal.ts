export interface Journal {
    id: string,
    journalId: string,
    userId: string,
    topicId: string,
    title: string,
    subTitle: string,
    entry: string,
    figures: string,
    createdDate: Date,
    lastModified: Date,
    hidden: boolean,
}