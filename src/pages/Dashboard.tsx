import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Trash2 } from "lucide-react"
import Nav from "@/components/Nav"
import { allGroups, allUsers } from "@/api/user"
import { User } from "@/types/user.types"
import { Group } from "@/types/group.type"

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [selectedGroups, setSelectedGroups] = useState<number[]>([])
    const [searchUsers, setSearchUsers] = useState("")
    const [searchGroups, setSearchGroups] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await allUsers()
            const res_group = await allGroups()
            setUsers(res)
            setGroups(res_group)
        }
        fetchUsers()
    }, [])

    console.log(users)
    const filteredUsers = users.filter(user =>
        user.given_name && user.given_name.toLowerCase().includes(searchUsers.toLowerCase()) ||
        user.family_name && user.family_name.toLowerCase().includes(searchUsers.toLowerCase())
    )

    const filteredGroups = groups.filter(user =>
        user.name && user.name.toLowerCase().includes(searchUsers.toLowerCase())
    )

    const handleDeleteUsers = () => {
        setSelectedUsers([]);
    }

    const handleDeleteGroups = () => {
        setSelectedGroups([]);
    }

    const count = Math.floor(Math.random() * users.length)

    return (
        <div className="bg-gray-50">

            {/* Header */}
            <Nav />

            {/* Dashboard */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="grid gap-6 md:grid-cols-2 mt-5">
                    {/* Users Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold">User</CardTitle>
                            {selectedUsers.length > 0 && (
                                <Button variant="destructive" size="sm" className="mt-4" onClick={handleDeleteUsers}>
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                {users.length} users
                                <span className="ml-2 text-green-500">
                                    {count} online
                                </span>
                                <span className="ml-2 text-red-600">
                                    {users.length - count} offline
                                </span>
                            </p>
                            <div className="mt-4">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search"
                                        value={searchUsers}
                                        onChange={(e) => setSearchUsers(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <div className="mt-4 space-y-4">
                                    {filteredUsers.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-4">
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedUsers(
                                                        checked
                                                            ? [...selectedUsers, user.id]
                                                            : selectedUsers.filter((id) => id !== user.id)
                                                    )
                                                }}
                                            />
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.image_url} alt={user.image_url} />
                                                <AvatarFallback>{user.given_name} {user.family_name}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 truncate">{user.given_name} {user.family_name}</div>
                                            {/* {user && (
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                            )} */}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Groups Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold">Groups</CardTitle>
                            {selectedGroups.length > 0 && (
                                <Button variant="destructive" size="sm" className="mt-4" onClick={handleDeleteGroups}>
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">{groups.length} groups</p>
                            <div className="mt-4">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search"
                                        value={searchGroups}
                                        onChange={(e) => setSearchGroups(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <div className="mt-4 space-y-4">
                                    {filteredGroups.map((group) => (
                                        <div key={group.id} className="flex items-center space-x-4">
                                            <Checkbox
                                                checked={selectedGroups.includes(group.id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedGroups(
                                                        checked
                                                            ? [...selectedGroups, group.id]
                                                            : selectedGroups.filter((id) => id !== group.id)
                                                    )
                                                }}
                                            />
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={""} alt={group.name} />
                                                <AvatarFallback>{group.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 truncate">{group.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Reports Section */}
                    {/* <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Report Submitted</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search"
                                        value={searchReports}
                                        onChange={(e) => setSearchReports(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="read"
                                            checked={showRead}
                                            onCheckedChange={(checked) => setShowRead(checked as boolean)}
                                        />
                                        <label
                                            htmlFor="read"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Read
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="unread"
                                            checked={showUnread}
                                            onCheckedChange={(checked) => setShowUnread(checked as boolean)}
                                        />
                                        <label
                                            htmlFor="unread"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Unread
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center space-x-4 rounded-lg border p-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Hello Hi World This is report
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </div>
    )
}
