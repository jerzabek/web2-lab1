import { comments } from '@prisma/client'
import React, { useEffect, useState } from 'react'

interface Props {
  onSubmit: (data: { text: string }) => void
  onCancel?: () => void
  editing?: comments
}

function CommentForm({ onSubmit, editing, onCancel }: Props) {
  const [text, setText] = useState(editing?.text ? editing.text : '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      text,
    })
  }

  useEffect(() => {
    if (!editing) {
      setText('')
      return
    }

    setText(editing.text)
  }, [editing])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="comment" className="form-label">
            {editing ? 'Update comment' : 'Create comment'}
          </label>
          <textarea
            name="comment"
            value={text}
            onChange={e => setText(e.target.value)}
            className="form-control"
          ></textarea>

          <input type="submit" value="Save" className="btn btn-success mt-2" />
          {editing && <input type="button" value="Cancel" className="btn btn-secondary ms-2 mt-2" onClick={onCancel} />}
        </div>
      </form>
    </div>
  )
}

export default CommentForm
