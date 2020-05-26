const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [
  {
    id: '4f774774-a6f0-4584-b62f-a5499cd8fe5e',
    title: 'Project title',
    url: 'Project description',
    techs: ["React", "Node.js"],
    likes: 0
  }
];

const likes = [
  {
    id: '3b0bc405-a113-4907-bdb9-e7f80f0dd421',
    repositoryId: '4f774774-a6f0-4584-b62f-a5499cd8fe5e',
  }
];

app.get("/repositories", (request, response) => {
  
  const repositoriesWithLikes = repositories.map(repo => {
    return {
      ...repo,
      likes: likes.filter(item => item.repositoryId === repo.id).length
    }
  })

  response.status(200).json(repositoriesWithLikes);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository)

  response.status(200).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const oldRepository = repositories[repositoryIndex];
  const newRepository = { ...oldRepository, title, url, techs };

  repositories[repositoryIndex] = newRepository;

  return response.status(200).json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({ message: "Repository successfully deleted" });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  
  likes.push({ id: uuid(), repositoryId: id });

  const repository = { likes: likes.filter(item => item.repositoryId === id).length };

  return response.status(200).json(repository);
});

module.exports = app;
