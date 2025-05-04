import mongoose from 'mongoose';

const FixtureSchema = new mongoose.Schema({
  _id: String,
  season: Number,
  competition_name: String,
  fixture_datetime: Date,
  fixture_round: Number,
  home_team: String,
  away_team: String,
});
if (mongoose.models.Fixture) {
  delete mongoose.models.Fixture;
}

export const Fixture = mongoose.models.Fixture || mongoose.model('Fixture', FixtureSchema);
