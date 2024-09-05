'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2, Plus, Eye } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { EditUserForm } from '@/components/EditUserForm'
import { CreateUserForm } from '@/components/CreateUserForm'
import {UserTableSkeleton } from '@/components/UserTableSkeleton'

interface User {
  id: number
  name: string
  email: string
  phone: string
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
      setLoading(false)
    } catch (err) {
      setError('Error fetching users. Please try again later.')
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleDelete = async (userId: number) => {
    setIsDeleting(userId)
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      setUsers(users.filter(user => user.id !== userId))
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSaveEdit = async (updatedUser: User) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      const data = await response.json()
      setUsers(users.map(user => user.id === data.id ? data : user))
      setEditingUser(null)
      toast({
        title: "Success",
        description: "User updated successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreate = async (newUser: Omit<User, 'id'>) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      const data = await response.json()
      setUsers([...users, data])
      setIsCreating(false)
      toast({
        title: "Success",
        description: "User created successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="text-center p-4"><UserTableSkeleton rowCount={5} /></div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <CreateUserForm
              onSave={handleCreate}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link to={`/users/${user.id}`} >
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </Link>
                  <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      {editingUser && (
                        <EditUserForm
                          user={editingUser}
                          onSave={handleSaveEdit}
                          onCancel={() => setEditingUser(null)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDelete(user.id)}
                    disabled={isDeleting === user.id}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}