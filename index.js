import {
  bio,
  skills,
  projects,
  education,
  footer,
} from "./data.js";

import { URLs } from './user-data/urls.js';

const {
  currentProject,
  webProjects,
  softwareProjects,
  androidProjects,
  gameDevProjects
} = projects;
const { medium, gitConnected } = URLs;

/**
* Fetches blogs from Medium profile.
*
* @async
* @param {string} url - The URL of the Medium profile.
* @returns {Promise<void>}
*/
async function fetchBlogsFromMedium(url) {
  try {
      const response = await fetch(url);
      const { items } = await response.json();
      populateBlogs(items, "blogs");
  } catch (error) {
      console.error(`Error in fetching blogs from Medium: ${error}`);
  }
}

/**
* Fetches data from GitConnected.
*
* @async
* @param {string} url - The URL of the GitConnected profile.
* @returns {Promise<void>}
*/
async function fetchGitConnectedData(url) {
  try {
      const response = await fetch(url);
      const { basics } = await response.json();
      mapBasicResponse(basics);
  } catch (error) {
      console.error(`Error in fetching data from GitConnected: ${error}`);
  }
}

/**
* Maps basic response from GitConnected and updates the document title.
* @param {Object} basics - The basic information from GitConnected.
*/
function mapBasicResponse(basics) {
  const { name } = basics;
  document.title = name;
}

/**
* Populates the bio section.
* @param {Array} items - An array of bio strings.
* @param {string} id - The ID of the bio container.
*/
function populateBio(items, id) {
  const bioTag = document.getElementById(id);
  if (!bioTag) {
      console.error(`Element with ID '${id}' not found.`);
      return;
  }

  if (!Array.isArray(items)) {
      console.error("Expected an array for bio items.");
      return;
  }

  items.forEach(bioItem => {
      const p = document.createElement("p");
      p.innerHTML = bioItem;
      bioTag.appendChild(p);
  });
}

/**
* Populates the skills section.
* @param {Array} items - An array of skill objects.
* @param {string} id - The ID of the skills container.
*/
function populateSkills(items, id) {
  const skillsTag = document.getElementById(id);
  if (!skillsTag) {
      console.error(`Element with ID '${id}' not found.`);
      return;
  }

  if (!Array.isArray(items)) {
      console.error("Expected an array for skills items.");
      return;
  }

  items.forEach(({ skillName, color, percentage }) => {
      const h3 = document.createElement("h3");
      h3.innerHTML = skillName;

      const progressBar = document.createElement("div");
      progressBar.className = `progress-bar color-${color}`;
      progressBar.style.width = `${percentage}%`;

      const progressWrap = document.createElement("div");
      progressWrap.className = "progress-wrap";
      progressWrap.append(h3, progressBar);

      const skillBox = document.createElement("div");
      skillBox.className = "col-md-6 animate-box";
      skillBox.appendChild(progressWrap);

      skillsTag.appendChild(skillBox);
  });
}

/**
* Populates the project sections.
* @param {Array} items - An array of project objects.
* @param {string} id - The ID of the project container.
*/
function populateProjects(items, id) {
  const projectContainer = document.getElementById(id);
  if (!projectContainer) {
      console.error(`Element with ID '${id}' not found.`);
      return;
  }

  if (!Array.isArray(items)) {
      console.error("Expected an array for project items.");
      return;
  }

  projectContainer.innerHTML = ""; // Clear existing content

  items.forEach(({ projectName, image, summary }) => {
      const card = document.createElement("div");
      card.className = "project-card";

      const nameHeading = document.createElement("h3");
      nameHeading.className = "project-name";
      nameHeading.textContent = projectName;

      const img = document.createElement("img");
      img.className = "project-image img-fluid";
      img.src = image;
      img.alt = projectName;

      const description = document.createElement("p");
      description.className = "project-description";
      description.textContent = summary;

      card.append(nameHeading, img, description);
      projectContainer.appendChild(card);
  });
}

// Populate sections
populateBio(bio, "bio");
populateSkills(skills, "skills");
populateProjects(currentProject, "current-project");
populateProjects(webProjects, "web-projects");
populateProjects(softwareProjects, "software-projects");
populateProjects(androidProjects, "android-projects");
populateProjects(gameDevProjects, "gameDev-projects");
populateExp_Edu(education, "education");

populateLinks(footer, "footer");
fetchBlogsFromMedium(medium);
fetchGitConnectedData(gitConnected);
