// Show loader animation
const showLoader = (mainDiv) => {
    const content = $(`.${mainDiv ? mainDiv : "content"}`);
    content.html(`<span class="loader"></span>`);
    $(".loader").show();
  };
  
  // Hide loader animation
  const hideLoader = () => {
    const content = $(".content");
    content.html(`<span class="loader"></span>`);
    $(".loader").hide();
  };

  
  export { showLoader, hideLoader };