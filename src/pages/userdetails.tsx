import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EditUserForm } from '@/components/EditUserForm'
import { useNavigate, useParams } from 'react-router-dom'

interface User {
  id: number
  name: string
  email: string
  phone: string
  website?: string
  company?: {
    name: string
    catchPhrase: string
    bs: string
  }
  address?: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
}

export default function UserDetail() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      const data = await response.json()
      setUser(data)
      setLoading(false)
    } catch (err) {
      setError('Error fetching user. Please try again later.')
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to fetch user. Please try again.",
        variant: "destructive",
      })
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
      setUser(data)
      setIsEditing(false)
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

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (error || !user) {
    return <div className="text-center p-4 text-red-500">{error || 'User not found'}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Button>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between items-center">
            {user.name}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit User</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <EditUserForm
                  user={user}
                  onSave={handleSaveEdit}
                  onCancel={() => setIsEditing(false)}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          {user.website && <p><strong>Website:</strong> {user.website}</p>}
          {user.company && (
            <div>
              <strong>Company:</strong>
              <p>{user.company.name}</p>
              <p><em>"{user.company.catchPhrase}"</em></p>
              <p>{user.company.bs}</p>
            </div>
          )}
          {user.address && (
            <div>
              <strong>Address:</strong>
              <p>{user.address.street}, {user.address.suite}</p>
              <p>{user.address.city}, {user.address.zipcode}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}