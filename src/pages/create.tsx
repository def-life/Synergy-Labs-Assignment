import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from '@/lib/types'

interface CreateUserFormProps {
  onSave: (newUser: Omit<User, 'id'>) => Promise<void>
  onCancel: () => void
}

export function CreateUserForm({ onSave, onCancel }: CreateUserFormProps) {
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    phone: '',
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await onSave(newUser)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={newUser.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={newUser.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={newUser.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isCreating}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}