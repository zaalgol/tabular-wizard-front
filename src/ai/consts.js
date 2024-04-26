export const trainingStrategyOptions = {
    'singleModelFast': 'Single Model Fast',
    'singleModelTuned': 'Single Model Tuned',
    'ensembleModelsFast': 'Ensemble Models Fast',
    'ensembleModelsTuned': 'ensemble Models Tuned'
};

export const samplingStrategyOptions = {
    'oversampling': 'Oversampling',
    'dontOversample': 'Don\'t Oversample',
    'conditionalOversampling': 'Oversample if Major Class > 2x Minor Class'
}

export const metricsRegressionOptions = { 'rmse': 'rmse', 'mae': 'mae' };

export const metricsclassificationOptions = {
    'accuracy': 'accuracy',
    'f1': 'f1',
    'neg_log_loss': 'neg_log_loss',
    'roc_auc': 'roc_auc',
    'recall': 'recall',
    'precision': 'precision'
};
