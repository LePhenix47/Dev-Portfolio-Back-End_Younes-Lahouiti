import { $ } from "bun";

/**
 * Checks if Docker Desktop is running by executing the `docker info` command.
 * If Docker is running, it logs a success message to the console.
 * If Docker is not running, it logs an error message and exits the process with an error code.
 *
 * @returns {Promise<void>} A promise that resolves when the check is complete.
 * @see [Run shell commands with Bun](https://bun.sh/docs/runtime/shell)
 */
async function checkIfDockerDesktopIsRunning(): Promise<void> {
  try {
    // Run 'docker info' to check if Docker is running
    await $`docker info`.text();
    console.log("✔ Check passed, Docker Engine is running!");
  } catch (error) {
    console.error(
      "✖ Docker Engine is not running. Please start Docker Desktop in order to build images and run the app on a container."
    );

    console.log(
      "%cYou can install Docker Desktop in the following link: https://www.docker.com/products/docker-desktop",
      "background: red"
    );

    process.exit(1); // Exit with an error code if Docker is not running
  }
}

checkIfDockerDesktopIsRunning();
