export default function Profile() {
  const profilePictureURL = "https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_f315b094.jpeg?" +
    "region=273%2C0%2C951%2C536"; // TODO: Make this so it takes the url from the user.

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6">
        {/* Using img over Image because for Image a config would be needed for all domains */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profilePictureURL}
          alt="Profile picture"
          className="w-24 h-24 object-cover rounded-full"
        />
        <p>
          Username
        </p>
        <p>
          E-mail
        </p>
      </div>
    </div>
  )
}