$('#document').change(function () {
  var document = $('#document').val().replace(/\\/g, '/').replace(/.*\//, '')
  if (document) {
    $('#alternative').hide()
    $('#document-name').html(document).addClass('text-success')
    $('#choose-file').hide()
    $('#label').hide()
    $('#remove-file-upload').show()
    previewFile()
  }
})

function previewFile () {
  // TODO: check that file type is not pdf
  var filePreview = document.getElementById('document-preview')
  var filePreviewTextElements = document.getElementsByClassName('document-preview-text')
  filePreview.style.display = 'block'
  filePreview.style.visibility = 'visible'

  for (var i = 0; i < filePreviewTextElements.length; i++) {
    var textElement = filePreviewTextElements[i]
    textElement.style.display = 'block'
    textElement.style.visibility = 'visible'
  }

  var file = document.querySelector('input[type=file]').files[0]
  var reader = new FileReader()

  reader.addEventListener('load', function () {
    filePreview.src = reader.result
  }, false)

  if (file) {
    reader.readAsDataURL(file)
  }
}
