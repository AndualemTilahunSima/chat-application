export type ChatThread = {
    id: number;
    name: string;
    avatar: string;
    preview: string;
    time: string;
    unread?: number;
};

export type ChatMessage = {
    side: "left" | "right";
    text: string;
    time: string;
};

export const chatThreads: ChatThread[] = [
    {
        id: 1,
        name: "Alice Johnson",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        preview: "See you tomorrow!",
        time: "5d ago",
        unread: 2,
    },
    {
        id: 2,
        name: "Bob Smith",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
        preview: "Thanks for the update!",
        time: "5d ago",
    },
    {
        id: 3,
        name: "Carol White",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        preview: "Let me know when you're free",
        time: "6d ago",
    },
    {
        id: 4,
        name: "David Brown",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        preview: "Sounds good 👍",
        time: "11/10/2025",
    },
    {
        id: 5,
        name: "Emma Davis",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        preview: "Can you send me the files?",
        time: "11/9/2025",
        unread: 1,
    },
];


const AliceMessages: ChatMessage[] = [
    { side: "left", text: "Hey! How are you doing?", time: "03:27 PM" },
    {
        side: "right",
        text: "I'm good! Thanks for asking. How about you?",
        time: "03:32 PM",
    },
    {
        side: "left",
        text: "Doing great! Want to meet up tomorrow?",
        time: "03:37 PM",
    },
    {
        side: "right",
        text: "Sure! What time works for you?",
        time: "03:42 PM",
    },
    {
        side: "left",
        text: "How about 2 PM at the coffee shop?",
        time: "04:17 PM",
    },
    {
        side: "right",
        text: "Perfect! I'll be there.",
        time: "04:19 PM",
    },
    {
        side: "left",
        text: "See you tomorrow!",
        time: "04:22 PM",
    },
];


const BobSmithMessages: ChatMessage[] = [
    { side: "right", text: "Did you finished the project?", time: "08:36 AM" },
    {
        side: "left",
        text: "Yes! Just submitted it.",
        time: "09:06 AM",
    },
    { side: "right", text: "Great work!", time: "09:24 AM" },
    { side: "left", text: "Thanks for the update!", time: "09:36 AM" },

];

const CarolWhiteMessages: ChatMessage[] = [
    {
        side: "left",
        text: "Hey, do you have time to chat?",
        time: "10:36 AM",
    },
    { side: "right", text: "I'm a bit busy right now", time: "11:06 AM" },
    { side: "left", text: "Let me know when you're free", time: "11:36 AM" },

];

const DavidBrownMessages: ChatMessage[] = [
    { side: "right", text: "Meeting at 3 PM?", time: "10:36 AM" },
    { side: "left", text: "Sounds good 👍", time: "11:36 AM" },

];

const EmmaDavisMessages: ChatMessage[] = [
    {
        side: "left",
        text: "Hi! How's everything going?",
        time: "10:36 AM",
    },
    { side: "right", text: "All good! Working on the presentation.", time: "11:06 AM" },
    { side: "left", text: "Can you send me the files?", time: "11:36 AM" },

];

export const chatMessagesByThread: Record<number, ChatMessage[]> = {
    1: AliceMessages,
    2: BobSmithMessages,
    3: CarolWhiteMessages,
    4: DavidBrownMessages,
    5: EmmaDavisMessages,
};