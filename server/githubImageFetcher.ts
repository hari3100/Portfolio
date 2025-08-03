// GitHub Showcase Image Fetcher
// Automatically fetches showcase images from GitHub repositories

export interface ImageCheckResult {
  url: string | null;
  format: string | null;
}

/**
 * Checks if a showcase image exists in the GitHub repository
 * Tries multiple formats: showcaseimage.jpg, showcaseimage.png, showcaseimage.jpeg
 */
export async function fetchShowcaseImage(
  username: string,
  repoName: string,
): Promise<ImageCheckResult> {
  const possibleImages = [
    "showcaseimage.jpg",
    "showcaseimage.png",
    "showcaseimage.jpeg",
    "showcase.jpg",
    "showcase.png",
    "showcase.jpeg",
  ];

  for (const imageName of possibleImages) {
    const imageUrl = `https://raw.githubusercontent.com/${username}/${repoName}/main/${imageName}`;

    try {
      // Use fetch with HEAD method to check if image exists without downloading it
      const response = await fetch(imageUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        console.log(`Found showcase image for ${repoName}: ${imageName}`);
        return {
          url: imageUrl,
          format: imageName.split(".").pop() || null,
        };
      }
    } catch (error) {
      // Continue to next image if this one fails
      console.log(`Image ${imageName} not found for ${repoName}`);
    }
  }

  console.log(`No showcase image found for ${repoName}`);
  return {
    url: null,
    format: null,
  };
}

/**
 * Updates existing projects with showcase images if they don't already have them
 */
export async function updateProjectsWithShowcaseImages(
  projects: any[],
): Promise<any[]> {
  const updatedProjects = [];

  for (const project of projects) {
    // Only fetch image if not already present
    if (!project.imageUrl) {
      // Extract owner from htmlUrl (e.g., "https://github.com/hari3100/repo-name")
      const urlParts = project.htmlUrl.split("/");
      const owner = urlParts[3]; // GitHub username
      const repoName = urlParts[4]; // Repository name

      const imageResult = await fetchShowcaseImage(owner, repoName);

      if (imageResult.url) {
        project.imageUrl = imageResult.url;
        console.log(
          `Updated ${project.name} with showcase image: ${imageResult.url}`,
        );
      }
    }

    updatedProjects.push(project);
  }

  return updatedProjects;
}
