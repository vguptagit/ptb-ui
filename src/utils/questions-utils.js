import jquery from 'jquery';
import CustomQuestionsService from '../services/CustomQuestionsService';
import QtiService from './qti-converter';

/**
 * Converts a question DTO to a question object.
 * @param {Object} questionDto - The question DTO to convert.
 * @returns {Object} A new question object with the qtiModel and itemId properties.
 */
export const getQuestionFromDto = questionDto => {
  const question = { ...questionDto };
  const qtiModel = QtiService.getQtiModel(question.qtixml, question.metadata.quizType);
  qtiModel.EditOption = false;
  question.qtiModel = qtiModel;
  question.masterData = JSON.parse(JSON.stringify(qtiModel));
  question.itemId = questionDto.guid;
  question.quizType = question.metadata.quizType;
  question.data = question.qtixml;

  if (question.quizType == 'FillInBlanks') {
    let xmlToHtml = transformCaptionToPrintFriendlyHtml(question.qtiModel.Caption);
    question.textHTML = xmlToHtml;
  } else {
    const questionTemplates = CustomQuestionsService.questionTemplates(question);
    question.textHTML = questionTemplates[0].textHTML;
  }
  question.spaceLine = 0;
  return question;
};

/**
 * Converts a caption string to HTML format for print mode, replacing buttons with blank spaces.
 * @param {string} caption - The caption string to convert.
 * @return {string} The HTML-formatted caption string with buttons replaced by blank spaces.
 */
export const transformCaptionToPrintFriendlyHtml = caption => {
  try {
    const htmlText = caption
      .trim()
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    var element = jquery('<p></p>');
    jquery(element).append(htmlText);
    element.find('button').each(function (i, obj) {
      let blankSpace = "<span class='blank'> _____________________ </span>";
      jquery(obj).replaceWith(blankSpace);
    });
    return element[0].innerHTML;
  } catch (e) {}
};

/**
 * Converts a node object to a question object.
 * @param {Object} data - The node object to convert.
 * @returns {Object} A new question object with the qtiModel and itemId properties.
 */
export const convertNodeToQuestion = (data, isDuplicate) => {
  const itemId = isDuplicate ? Math.random().toString(36).slice(2) : data.guid;
  const question = {
    qtiModel: data.qtiModel,
    quizType: data.quizType || data.metadata.quizType,
    qtixml: data.qtixml,
    itemId,
    data: data.qtixml,
    spaceLine: 0,
  };

  if (!isDuplicate) {
    question.guid = data.guid;
  }

  const questionTemplates = CustomQuestionsService.questionTemplates(question);

  if (question.quizType === 'FillInBlanks') {
    question.textHTML = transformCaptionToPrintFriendlyHtml(question.qtiModel.Caption);
  } else {
    question.textHTML = questionTemplates[0]?.textHTML;
  }

  return question;
};

/**
 * Returns a new question object based on the provided questionTemplate.
 * @param {Object} questionTemplate - The template for the question.
 * @returns {Object} A new question object with the qtiModel and itemId properties.
 */
export const transformQuestionTemplateToQuestion = questionTemplate => {
  const { data, quizType } = questionTemplate;
  const qtiModel = QtiService.getQtiModel(data, quizType);
  qtiModel.EditOption = true;
  const itemId = Math.random().toString(36).slice(2);

  return { ...questionTemplate, qtiModel, itemId };
};

/**
 * Rearranges the questions array by moving the question with the given dragSourceId to the position of the question with the given dropTargetId.
 *
 * @param {Object[]} questions - The array of questions to be rearranged.
 * @param {string} dragSourceId - The guid or itemId of the question to be moved.
 * @param {string} dropTargetId - The guid or itemId of the question that the dragSource question will be moved to.
 *
 * @returns {Object[]} The rearranged questions array.
 */
export const rearrangeQuestions = (questions, dragSourceId, dropTargetId) => {
  // Find the indices of the drag source and drop target
  const dragSourceIndex = questions.findIndex(
    question => question.guid === dragSourceId || question.itemId === dragSourceId
  );
  const dropTargetIndex = questions.findIndex(
    question => question.guid === dropTargetId || question.itemId === dropTargetId
  );

  // Get the drag source item
  const dragSourceItem = { ...questions[dragSourceIndex] };

  // Remove the drag source item from the array
  questions.splice(dragSourceIndex, 1);

  // Insert the drag source item at the drop target index
  questions.splice(dropTargetIndex, 0, dragSourceItem);

  return questions;
};
