# Releasio

**Release notes and changelogs made simple.**

[Visit Releasio](https://releasio.vercel.com)

---

## Overview
Releasio makes it easy to generate and display release notes and changelogs in your application. Whether you're a developer looking for a quick setup or a product team wanting to enhance visibility of updates, Releasio has you covered.

---

## Getting Started

### Generate Your First Release Note
Run the following command to generate your first release note:
```bash
npx releasio -t <token>
```

### Display Release Notes in Your React Application
Install Releasio with npm:
```bash
npm i releasio
```

Use the provided hook to fetch and display release notes:
```typescript
import { useReleasio } from "releasio";

const { updateAvailable, version, changelogs, error } = useReleasio({ 
  token: "<your_token>", 
  commit: "<LAST_GIT_COMMIT_SHA>" 
});

if (updateAvailable) {
  console.log("New version available:", version);
  console.log("Changelogs:", changelogs);
}
```

---

## API Description

### `useReleasio` Hook

The `useReleasio` hook provides an easy way to access release note information in your React application.

#### Parameters:
- `token` (string): Your unique authentication token.
- `commit` (string): The SHA of the last known Git commit.

#### Returns:
- **`updateAvailable`** (boolean): Indicates if there is a new version available.
- **`version`** (string): The latest available version of your application.
- **`changelogs`** (string[]): An array of strings representing the changes in the latest version.
- **`error`** (string | null): Error message if fetching release notes fails.

---

## Examples

### Check for Updates and Display Release Notes
```typescript
import { useReleasio } from "releasio";

const ReleaseNotes = () => {
  const { updateAvailable, version, changelogs, error } = useReleasio({
    token: "<your_token>",
    commit: "<LAST_GIT_COMMIT_SHA>",
  });

  if (error) {
    return <div>Error fetching release notes: {error}</div>;
  }

  if (!updateAvailable) {
    return <div>Your application is up-to-date!</div>;
  }

  return (
    <div>
      <h1>New Version Available: {version}</h1>
      <ul>
        {changelogs.map((change, index) => (
          <li key={index}>{change}</li>
        ))}
      </ul>
    </div>
  );
};
```

---


## License
Releasio is licensed under the [MIT License](LICENSE).