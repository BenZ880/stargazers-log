const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function formatStars(stars) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(stars);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function createRepositoryItem(repository) {
  const item = document.createElement("li");
  item.className = "repository";

  const topline = document.createElement("div");
  topline.className = "repository-topline";

  const heading = document.createElement("h3");
  heading.className = "repository-name";

  const link = document.createElement("a");
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = repository.name;
  heading.append(link);

  const owner = document.createElement("span");
  owner.className = "repository-owner";
  owner.textContent = ` / ${repository.owner}`;
  heading.append(owner);

  const date = document.createElement("time");
  date.className = "repository-date";
  date.dateTime = repository.starredAt;
  date.textContent = `Starred ${formatDate(repository.starredAt)}`;

  topline.append(heading, date);

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const metadata = document.createElement("p");
  metadata.className = "repository-meta";

  const language = document.createElement("span");
  language.textContent = repository.language;

  const stars = document.createElement("span");
  stars.textContent = `${formatStars(repository.stars)} stars`;

  metadata.append(language, stars);
  item.append(topline, description, metadata);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    repositoryList.replaceChildren(...repositories.map(createRepositoryItem));
    repositoryCount.textContent = `${repositories.length} repositories`;
  } catch (error) {
    repositoryList.replaceChildren();
    const message = document.createElement("li");
    message.className = "status-message";
    message.textContent = "The repository list could not be loaded.";
    repositoryList.append(message);
    repositoryCount.textContent = "Unavailable";
    console.error(error);
  }
}

loadRepositories();