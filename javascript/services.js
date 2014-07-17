define(['handler_registry'], function(HandlerRegistry) {
  return {
    handlerRegistry: new HandlerRegistry('/resources/handlers.json')
  };
});
