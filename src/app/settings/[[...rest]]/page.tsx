import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
  <div>
      <UserProfile
        appearance={{
          variables: {
            colorBackground: "#040a18",
          }
        }}
        path="/settings"
       />
    </div>
  );
}