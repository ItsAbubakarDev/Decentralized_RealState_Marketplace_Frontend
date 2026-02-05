import UserProfile from "@/components/UserProfile";

export const metadata = {
    title: "My Profile | Decentralized Estate",
    description: "Manage your properties and reviews",
};

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-background pb-20 pt-10">
            <UserProfile />
        </div>
    );
}
