
import { useState, type FormEvent } from 'react'
import type { Note } from '../types/note'

interface NoteFormProps {
  onAddNote: (note: Omit<Note, 'id'>) => void
}

function NoteForm({ onAddNote }: NoteFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim() || !content.trim() || !category.trim()) {
      return
    }

    onAddNote({
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
    })

    setTitle('')
    setContent('')
    setCategory('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tambah Catatan</h2>

      <input
        type="text"
        placeholder="Judul catatan"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Isi catatan"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Kategori"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <button type="submit">Tambah Catatan</button>
    </form>
  )
}

export default NoteForm
