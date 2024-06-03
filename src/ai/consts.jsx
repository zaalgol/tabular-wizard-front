export const trainingStrategyOptions = {
    'singleModelFast': 'Single Model Fast',
    'singleModelTuned': 'Single Model Tuned',
    'ensembleModelsFast': 'Ensemble Models Fast',
    'ensembleModelsTuned': 'ensemble Models Tuned'
};

export const samplingStrategyOptions = {
    'conditionalOversampling': 'Oversample if Major Class > 2x Minor Class',
    'oversampling': 'Oversampling',
    'dontOversample': 'Don\'t Oversample'
    
}

export const metricsRegressionOptions = {
    'r2': 'R2 - R-squared (R2)',
    'neg_root_mean_squared_error': 'RMSE - Root Mean Squared error',
    'neg_mean_squared_error': 'MSE - Mean Squared Error',
    'neg_mean_absolute_error': 'MAE - Mean Absolute Error',
    'neg_mean_absolute_percentage_error': 'MAPE - Mean Absolute Percentage Error'
};

export const metricsclassificationOptions = {
    'accuracy': 'accuracy',
    'f1': 'f1',
    'log_loss': 'log loss',
    'roc_auc': 'roc auc',
    'recall': 'recall',
    'precision': 'precision'
};
