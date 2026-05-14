'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::project.project', ({ strapi }) => ({
  async delete(documentId, params) {
    console.log("=== PROJECT DELETE SERVICE FIRED ===");

    // Get project with all relations
    const project = await strapi.documents("api::project.project").findOne({
      documentId,
      populate: ["characters", "context_items", "queries", "chat_threads"]
    });

    if (project) {
      // Delete all characters
      if (project.characters?.length > 0) {
        for (const character of project.characters) {
          console.log("Deleting character:", character.name);
          await strapi.documents("api::character.character").delete({
            documentId: character.documentId
          });
        }
      }

      // Delete all context items
      if (project.context_items?.length > 0) {
        for (const item of project.context_items) {
          console.log("Deleting context item:", item.title);
          await strapi.documents("api::context-item.context-item").delete({
            documentId: item.documentId
          });
        }
      }

      // Delete all queries
      if (project.queries?.length > 0) {
        for (const query of project.queries) {
          await strapi.documents("api::query.query").delete({
            documentId: query.documentId
          });
        }
      }

      // Delete chat threads and their messages
      if (project.chat_threads?.length > 0) {
        for (const thread of project.chat_threads) {
          const messages = await strapi.documents("api::message.message").findMany({
            filters: { chat_thread: { documentId: { $eq: thread.documentId } } }
          });

          for (const message of messages) {
            await strapi.documents("api::message.message").delete({
              documentId: message.documentId
            });
          }

          console.log("Deleting thread:", thread.documentId);
          await strapi.documents("api::chat-thread.chat-thread").delete({
            documentId: thread.documentId
          });
        }
      }
    }

    // Now delete the project itself
    return super.delete(documentId, params);
  }
}));