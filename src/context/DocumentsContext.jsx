import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const DocumentsContext = createContext(null)

export const useDocuments = () => {
  const context = useContext(DocumentsContext)
  if (!context) {
    throw new Error('useDocuments must be used within DocumentsProvider')
  }
  return context
}

export const DocumentsProvider = ({ children }) => {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [allDocuments, setAllDocuments] = useState([]) // Store all documents from localStorage

  useEffect(() => {
    // Load all documents from localStorage
    const savedDocs = localStorage.getItem('documents')
    if (savedDocs) {
      try {
        const docs = JSON.parse(savedDocs)
        setAllDocuments(docs)
        
        if (user) {
          // Filter documents for current user
          const userDocs = docs.filter(doc => doc.userId === user.id)
          setDocuments(userDocs)
        } else {
          setDocuments([])
        }
      } catch (error) {
        console.error('Error parsing documents:', error)
        setAllDocuments([])
        setDocuments([])
      }
    } else {
      setAllDocuments([])
      setDocuments([])
    }
  }, [user])

  const createDocument = (documentData) => {
    if (!user) {
      throw new Error('User must be logged in to create a document')
    }
    
    const newDocument = {
      id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      ...documentData,
      status: 'active',
      createdAt: new Date().toISOString(),
      documentNumber: `INS-${Date.now()}`
    }

    const updatedDocuments = [...documents, newDocument]
    setDocuments(updatedDocuments)

    // Save to localStorage
    const allDocs = [...allDocuments, newDocument]
    setAllDocuments(allDocs)
    localStorage.setItem('documents', JSON.stringify(allDocs))

    return newDocument
  }

  const getDocumentById = (id) => {
    // First try to find in user's documents
    const userDoc = documents.find(doc => doc.id === id)
    if (userDoc) {
      return userDoc
    }
    
    // If not found, search in all documents (useful when accessing via direct URL)
    const allDoc = allDocuments.find(doc => doc.id === id)
    if (allDoc) {
      return allDoc
    }
    
    return null
  }

  return (
    <DocumentsContext.Provider value={{ documents, createDocument, getDocumentById }}>
      {children}
    </DocumentsContext.Provider>
  )
}
