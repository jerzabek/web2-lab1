import React, { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { comments } from '@prisma/client'
import moment from 'moment'
import Router from 'next/router'
import postJson from '../../api/post'
import CommentForm from './CommentForm'
import styled from 'styled-components'
import useIsAdmin from '../../utils/isAdmin'
import { Edit, Trash } from 'react-feather'

interface Props {
  comments: comments[]
  round: number
}

const Comment = styled.div`
  padding: 10px;
  border-bottom: 1px solid #0000001f;

  &:last-child {
    border-bottom: none;
  }
`

function CommentList({ comments, round }: Props) {
  const { user } = useUser()

  const [editing, setEditing] = useState<comments | undefined>()

  const isAdmin = useIsAdmin()

  const handleCreateComment = async (data: { text: string }) => {
    try {
      await postJson(`/api/comment/create`, { ...data, round })

      Router.reload()
    } catch (e) {
      console.log('err occurred', e)
    }
  }

  const handleDelete = (id: number) => async () => {
    try {
      await postJson(`/api/comment/delete/${id}`)

      Router.reload()
    } catch (e) {
      console.log('err occurred', e)
    }
  }

  const handleEditComment = async (comment: { text: string }) => {
    if (!editing) return

    try {
      await postJson(`/api/comment/edit/${editing.id}`, comment)

      Router.reload()
    } catch (e) {
      console.log('err occurred', e)
    }
  }

  const beginEdit = (comment: comments) => () => {
    setEditing(comment)
  }

  const handleCancelEdit = () => {
    setEditing(undefined)
  }

  return (
    <>
      {user && (
        <CommentForm
          onSubmit={editing ? handleEditComment : handleCreateComment}
          editing={editing}
          onCancel={handleCancelEdit}
        />
      )}
      <div>
        {comments.map(comment => {
          const isAuthor = user?.email === comment.user

          return (
            <Comment key={comment.id}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <b>{comment.user}</b> -{' '}
                  <span className="text-muted">{moment.utc(comment.created_at).format('DD.MM.YY - HH:mm')}</span>
                </div>

                <div className="d-flex align-items-center">
                  {comment.modified_at && (
                    <span className="text-muted">
                      edited at {moment.utc(comment.modified_at).format('DD.MM.YY - HH:mm')}
                    </span>
                  )}
                  {(isAdmin || isAuthor) && (
                    <div className="ms-2">
                      <button className="btn btn-danger btn-sm" onClick={handleDelete(comment.id)}>
                        <Trash />
                      </button>
                    </div>
                  )}
                  {isAuthor && (
                    <div className="ms-2">
                      <button className="btn btn-primary btn-sm" onClick={beginEdit(comment)}>
                        <Edit />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p>{comment.text}</p>
            </Comment>
          )
        })}
      </div>
    </>
  )
}

export default CommentList
