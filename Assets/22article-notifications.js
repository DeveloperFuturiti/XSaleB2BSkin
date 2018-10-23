function ArticleNotification(offerStockPriceId) {
        SetArticleNotification(offerStockPriceId);
        ArticleNotificationMessage();
};
function SetArticleNotification(offerStockPriceId) {
    return $.ajax({
        type: "POST",
        url: "/Notification/SetArticleNotification",
        data: { offerStockPriceId: offerStockPriceId },
        success: function (data) {
        },
        async: false
    })
}
function ArticleNotificationMessage() {
    swal({
        title: "",
        text: "Zosostaniesz powiadomiony o dostępności tego towaru",
        type: "warning",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: "OK",
        closeOnConfirm: false,
        closeOnCancel: false
    });
}
function DeleteNotification(item) {
    swal({
        title: "",
        text: "Czy na pewno chcesz usunąć powiadomienie dla tego towaru?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: 'btn-danger',
        confirmButtonText: "Tak",
        cancelButtonText: "Nie",
        closeOnConfirm: false,
        closeOnCancel: false
    },
      function (isConfirm) {
          if (isConfirm) {
              DeleteNotificationFromList(item.attributes.id.value);
              swal.close();
          } else {
              swal.close();
          }
      });
}
function DeleteNotificationFromList(id) {
    return $.ajax({
        type: "POST",
        url: "/Notification/Delete",
        data: { id: id },
        success: function (data) {
            $('#table-datatable-notification-list').DataTable().draw()
        },
        async: false
    })
}