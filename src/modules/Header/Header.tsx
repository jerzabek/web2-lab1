/* eslint-disable @next/next/no-html-link-for-pages */
import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import React from 'react'
import useIsAdmin from '../../utils/isAdmin'

function Header() {
  const { user, isLoading } = useUser()
  const isAdmin = useIsAdmin()

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">HNL Rezultati</a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav w-100">
            <Link href="/">
              <a className="nav-link me-2">Utakmice</a>
            </Link>
            <Link href="/points" className="nav-link">
              <a className="nav-link me-auto">Bodovi</a>
            </Link>

            {!isLoading ? (
              user ? (
                <>
                  {isAdmin && (
                    <Link href="/create" className="nav-link me-2">
                      <a className="nav-link text-success">Nova tekma</a>
                    </Link>
                  )}
                  <Link href="/profile" className="nav-link me-2">
                    <a className="nav-link">Profil</a>
                  </Link>
                  <a href="/api/auth/logout" className="nav-link">
                    Odjava
                  </a>
                </>
              ) : (
                <a href="/api/auth/login" className="nav-link">
                  Prijava
                </a>
              )
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
