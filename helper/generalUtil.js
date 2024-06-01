module.exports = {
  createMetaPagination: (total, page = 1, show = 10) => {
    const remainder = total % show;
    const lastPage = Math.floor(total / show) + Number(!remainder ? 0 : 1);
    
    let previousPage = null;
    if (page <= lastPage && page > 1) {
      previousPage = page + 1;
    } 

    let nextPage = null;
    if (page < lastPage) {
      nextPage = page + 1;
    } else if (page === lastPage) {
      nextPage = page
    }

    return {
      total,
      perPage: show,
      currentPage: page,
      previousPage,
      lastPage,
      nextPage,
    }
  }
}