'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const Contact = () => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Contact</CardTitle>
                    <CardDescription>Send us a message</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" type="text" placeholder="Name" />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Email" />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Message" />
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit">Send</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Contact
