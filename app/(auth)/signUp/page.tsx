'use client';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUp() {

    return (
        <div className="space-y-6 flex justify-center items-center h-[100vh]">
            <div className='w-[50%]'>
                <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">👋 Sign up you self</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-slate-300">Reason for contact</Label>
                            <Input
                                placeholder="Briefly describe your issue"
                                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <Label className="text-slate-300">Subject</Label>
                            <Input
                                placeholder="Briefly describe your issue"
                                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <Label className="text-slate-300">Description</Label>
                            <Input
                                placeholder="Briefly describe your issue"
                                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <Label className="text-slate-300">Email for responses</Label>
                            <Input
                                defaultValue="alex.chen@example.com"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                            <p className="text-xs text-slate-400 mt-1">We'll use this email to follow up on your request</p>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Submit Request
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}