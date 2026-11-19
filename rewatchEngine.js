function hasCircularDependency(allMovies, targetId, proposedPrereqIds) {
  const movieMap = new Map();
  for (const movie of allMovies) {
    movieMap.set(String(movie._id), movie);
  }

  const visited = new Set();
  const stack = [...proposedPrereqIds.map(String)];

  while (stack.length > 0) {
    const currentId = stack.pop();
    if (currentId === String(targetId)) {
      return true;
    }
    if (!visited.has(currentId)) {
      visited.add(currentId);
      const currentMovie = movieMap.get(currentId);
      if (currentMovie && Array.isArray(currentMovie.prerequisites)) {
        for (const prereqId of currentMovie.prerequisites) {
          stack.push(String(prereqId));
        }
      }
    }
  }

  return false;
}

function buildRewatchPlan(allMovies, targetId) {
  const movieMap = new Map();
  for (const movie of allMovies) {
    movieMap.set(String(movie._id), movie);
  }

  const targetMovie = movieMap.get(String(targetId));
  if (!targetMovie) {
    return null;
  }

  const visited = new Set();
  const ordered = [];

  function dfs(movieId) {
    const idStr = String(movieId);
    if (visited.has(idStr)) return;
    visited.add(idStr);

    const movie = movieMap.get(idStr);
    if (!movie) return;

    for (const prereqId of movie.prerequisites || []) {
      dfs(prereqId);
    }

    if (idStr !== String(targetId)) {
      ordered.push(movie);
    }
  }

  dfs(targetId);

  let watchedCount = 0;
  let remainingRuntimeMinutes = 0;

  for (const m of ordered) {
    if (m.watched) {
      watchedCount += 1;
    } else {
      remainingRuntimeMinutes += Number(m.runtime) || 0;
    }
  }

  return {
    targetMovie: {
      id: String(targetMovie._id),
      title: targetMovie.title,
    },
    rewatchOrder: ordered.map((m) => ({
      id: String(m._id),
      title: m.title,
      releaseYear: m.releaseYear,
      runtime: m.runtime,
      watched: Boolean(m.watched),
      prerequisites: (m.prerequisites || []).map(String),
    })),
    totalMovies: ordered.length,
    watchedCount,
    remainingRuntimeMinutes,
  };
}

module.exports = {
  hasCircularDependency,
  buildRewatchPlan,
};