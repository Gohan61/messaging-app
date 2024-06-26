import WelcomeImage from "/beijing-1877354_1920.jpg";

export default function Homepage() {
  return (
    <div className="homePage">
      <h1 className="welcomeTitle">Welcome to the Book Stranger Chat</h1>
      <img
        src={WelcomeImage}
        alt="A person in a library checking a book"
        className="welcomeImage"
      />
      <p className="welcomeText">
        Hello stranger! We send you our warm greetings. This chat is designed
        for you to discuss books with other strangers in this chat. Simply sign
        up and send someone a chat. After logging in, you can check out other
        users and their profiles to maybe discover someone with the same genre
        interests. Have fun and keep it polite!
      </p>
    </div>
  );
}
