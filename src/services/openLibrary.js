const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json'
export async function searchBookCover(title, author) {
    const params = new URLSearchParams({
        title,
        author,
        field: 'title,author_name,cover_i,key',
        limit: '5',
    })
    try {
        const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`)
        if (!response.ok) {
            throw new Error(`Open Library request failed: ${response.status}`)
        }
        const data = await response.json()
        const bookWithCover = data.docs?.find(
            (book) => Number.isInteger(book.cover_i)
        )
        if (!bookWithCover) {
            return null
        }
        return {
            coverId: bookWithCover.cover_i,
            coverUrl: `https://covers.openlibrary.org/b/id/${bookWithCover.cover_i}-L.jpg`,
        }
    }
    catch (error) {
        console.error('Could not fetch book cover:', error)
        return null
    }
}