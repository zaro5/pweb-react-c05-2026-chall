
import { useEffect, useState } from 'react'
import type { Note } from './types/note'
import type { Post } from './types/post'
import NoteForm from './components/NoteForm'
import NoteCard from './components/NoteCard'
import './App.css'

const STORAGE_KEY = 'modul5_pemweb_notes'
const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=10'

const DEFAULT_NOTES: Note[] = [
  {
    id: '1',
    title: 'Belajar React Hook',
    content: 'Memahami useState dan useEffect.',
    category: 'Kuliah',
  },
  {
    id: '2',
    title: 'Persiapan Modul 5',
    content: 'Menyiapkan fitur filter judul dan localStorage.',
    category: 'Praktikum',
  },
]

function App() {
  // State catatan lokal
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as Note[]) : DEFAULT_NOTES
    } catch {
      return DEFAULT_NOTES
    }
  })

  // State pencarian lokal
  const [searchQuery, setSearchQuery] = useState('')

  // State REST API
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Menyimpan catatan ke localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  // Mengambil data dari REST API menggunakan GET
  useEffect(() => {
    const controller = new AbortController()

    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(API_URL, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data post')
        }

        const data: Post[] = await response.json()
        setPosts(data)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchPosts()

    return () => controller.abort()
  }, [])

  // Menambahkan catatan baru
  const handleAddNote = (newNote: Omit<Note, 'id'>) => {
    const note: Note = {
      ...newNote,
      id: crypto.randomUUID(),
    }

    setNotes((previousNotes) => [...previousNotes, note])
  }

  // Menghapus catatan lokal
  const handleDeleteNote = (id: string) => {
    setNotes((previousNotes) =>
      previousNotes.filter((note) => note.id !== id)
    )
  }

  // Filter catatan berdasarkan judul
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )

  return (
    <main>
      <h1>Notes App</h1>
      <p>Aplikasi Papan Catatan Modul 5</p>

      {/* Form tambah catatan */}
      <NoteForm onAddNote={handleAddNote} />

      {/* Daftar catatan lokal */}
      <section>
        <h2>Daftar Catatan</h2>

        <input
          type="text"
          placeholder="Cari judul catatan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredNotes.length === 0 ? (
          <p>Tidak ada catatan yang cocok.</p>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
            />
          ))
        )}
      </section>

      {/* Daftar post dari REST API */}
      <section>
        <h2>Daftar Post dari REST API</h2>

        {loading && <p>Memuat data post...</p>}

        {error && (
          <p role="alert">Error: {error}</p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p>Belum ada post.</p>
        )}

        {!loading &&
          !error &&
          posts.map((post) => (
            <article key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <small>User ID: {post.userId}</small>
            </article>
          ))}
      </section>
    </main>
  )
}

export default App
