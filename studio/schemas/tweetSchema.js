export const tweetSchema = {
    name: 'tweets',
    title: 'Tweets',
    type: 'document',
    fields: [
        {
            name: 'tweet',
            title: 'Tweet',
            type: 'string',
        },
        {
            name: 'timestamp',
            type: 'datetime',
            title: 'Timestamp',
        },
        {
            name: 'author',
            title: 'author',
            type: 'reference',
            to: [{ type: 'users' }],
        }
    ]
}